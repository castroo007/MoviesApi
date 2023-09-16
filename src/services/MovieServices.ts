
import IMovie from "../interfaces/MovieInterface.js";
import MovieRepositories from "../repositories/MovieRepositories.js";
class MovieService {
    async getAllMovies(
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: string,
        filters: any) {
        try {
          const sortParams: { [key: string]: 'asc' | 'desc' } = {
            [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
          }
          let totalMovies = 0;
          const defaultQuery: any = {}
    
          for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
              const value = filters[key];
              if (key === 'title') {
                defaultQuery[key] = { $regex: value, $options: 'i' }
              } else if (key === 'genres'
                && Array.isArray(value) && value.length > 0) {
                const validGenres = value.filter((genre: string) => genre.trim() !== '')
                if (validGenres.length > 0) {
                  defaultQuery[key] = { $all: validGenres }
                }
              } else if (key === 'year') {
                defaultQuery['releaseDate'] = {
                  $gte: new Date(`${value}-01-01`),
                  $lt: new Date(`${parseInt(value + 1)}-01-01`),
                }
              } else {
                defaultQuery[key] = value;
              }
            }
          }
    
          const result = await
            MovieRepositories.getAllMovies(defaultQuery, page, limit, sortParams);

            const responseData = {
                movies: result.movies,
                currentPage: page,
                totalPages: Math.ceil(result.totalMovies / limit)
            }
            return responseData;
        } catch (error) {
          throw error
        }
      }

    async createMovie(movieData: IMovie) {
        try {

            const savedMovie = await MovieRepositories.createMovie(movieData);

            return savedMovie;


        } catch (error) {
            throw error;
        }

    }

    async getMovieById(id: string) {
        try {
        const movie  = await MovieRepositories.getMovieByID(id);

        return movie;
        } catch (error) {
            throw error;
        }
    }
}

export default new MovieService();