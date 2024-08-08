import {
  Controller,
  Get,
  HttpCode,
  Query,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import axios, { AxiosResponse } from 'axios';
import parse from 'node-html-parser';

@Controller('shows')
export class ShowsController {
  constructor() {}
  private BASE_URL = `https://api.tvmaze.com/`;
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All shows & search' })
  @ApiQuery({
    name: 'q',
    type: 'string',
    description: 'Query for search',
    required: false,
  })
  @ApiQuery({
    name: 'amount',
    type: 'number',
    description: 'Number of shows',
    required: false,
  })
  @ApiOkResponse({})
  async getAllArticles(@Query() query) {
    const { q, amount } = query;
    let queryString: string;
    let result: any[];
    if (q) {
      queryString = `${this.BASE_URL}search/shows?q=${q}`;
      const showsRequest = await axios.get(queryString);
      const data = showsRequest.data.map((el) => el.show);
      result = amount ? data.slice(0, amount) : data;
    } else {
      queryString = `${this.BASE_URL}shows`;
      const showsRequest = await axios.get(queryString);
      result = amount ? showsRequest.data.slice(0, amount) : showsRequest.data;
    }

    return result;
  }

  @Get('/popular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get popular shows' })
  @ApiOkResponse({})
  async getMostPopular(@Param() params) {
    const showsRequest = await axios.get(`${this.BASE_URL}shows`);
    const shows = showsRequest.data
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 9);
    return shows;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One show' })
  @ApiParam({ name: 'id', description: 'id of show' })
  @ApiOkResponse({})
  async getOneArticles(@Param() params) {
    const { id } = params;
    const queryString = `${this.BASE_URL}shows/${id}`;
    const showRequest = await axios.get(queryString);
    const seriesRequest = await axios.get(`${queryString}/episodes`);
    const views = Math.floor(Math.random() * 10000);
    return { ...showRequest.data, views, series: seriesRequest.data };
  }

  @Get('/byGenre/:genre')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shows by genre' })
  @ApiParam({ name: 'genre', description: 'genre for show' })
  @ApiQuery({
    name: 'amount',
    type: 'number',
    description: 'Number of shows',
    required: false,
  })
  @ApiOkResponse({})
  async getByArticle(@Param() params, @Query() query) {
    const { amount } = query;
    const showsRequest = await axios.get(`${this.BASE_URL}shows`);
    const shows = showsRequest.data.filter((el) =>
      el.genres
        .map((el) => el.toLowerCase())
        .includes(params.genre.toLowerCase()),
    );
    return amount ? shows.slice(0, amount) : shows;
  }

  @Get('/byCountry/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get popular shows by country' })
  @ApiParam({ name: 'id', description: 'country id' })
  @ApiOkResponse({})
  async getPopularByCountry(@Param() params, @Query() query) {
    const { amount } = query;
    const showsRequest = await axios.get(
      `${this.BASE_URL}shows?Show%5Bcountry_enum%5D=${params.id}`,
    );
    const shows = showsRequest.data.sort(
      (a, b) => b.rating.average - a.rating.average,
    );
    return amount ? shows.slice(0, amount) : shows;
  }

  @Get('/actor/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Actor by id' })
  @ApiParam({ name: 'id', description: 'Actor id' })
  @ApiOkResponse({})
  async getActor(@Param() params) {
    const actorRequest = await axios.get(`${this.BASE_URL}people/${params.id}`);
    const casts = await axios.get(
      `${this.BASE_URL}people/${params.id}/castcredits`,
    );
    const castsData = casts.data;
    const castsRequests = castsData.map((el) => el._links.show.href);
    const castsPromises = await Promise.all(
      castsRequests.map((req) => axios.get(req)),
    );

    const castsResult = castsPromises.map((el: AxiosResponse) => ({
      id: el.data.id,
      name: el.data.name,
      rating: el.data.raiting,
      image: el.data.image,
    }));
    const actorData = actorRequest.data;

    const test = await axios.get(actorData.url);
    const root = parse(test.data);
    actorData.summary = root
      .querySelector('#general-information article')
      .textContent.toString()
      .trim();
    return {
      ...actorData,
      casts: castsResult,
    };
  }

  @Get(':id/cast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get show Cast' })
  @ApiParam({ name: 'id', description: 'show id' })
  @ApiOkResponse({})
  async getShowCast(@Param() params, @Query() query) {
    const castRequest = await axios.get(
      `${this.BASE_URL}shows/${params.id}/cast`,
    );
    return castRequest.data;
  }
}
