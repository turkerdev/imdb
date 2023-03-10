import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import tmdb from "~/tmdb.server";
import { Star } from "phosphor-react";
import type { MovieImagesResponse, MovieResponse } from "moviedb-promise";

export async function loader({ params }: LoaderArgs) {
  const { id } = await z
    .object({
      id: z.string(),
    })
    .parseAsync(params);
  const movie = (await tmdb.movieInfo({
    id,
    append_to_response: "images",
  })) as MovieResponse & { images: MovieImagesResponse };
  return movie;
}

const Film: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="max-w-[1280px] mx-auto py-4 relative px-2">
      <img
        src={`https://image.tmdb.org/t/p/w1920_and_h600_multi_faces${data.backdrop_path}`}
        alt={data.title}
        width={1920}
        height={600}
        className="drop-shadow-lg lg:rounded-lg"
      />
      <span className="absolute flex gap-1 items-center top-4 rounded-full m-2 p-2 font-bold text-white bg-yellow-500 border-2 z-10">
        <Star weight="fill" />
        {data.vote_average?.toFixed(1)}
      </span>
      <div className="flex flex-col gap-12 sm:gap-24 my-6">
        <div>
          <h1 className="text-center text-4xl font-bold tracking-tighter drop-shadow underline">
            {data.title}
          </h1>
          <p className="mt-6">{data.overview}</p>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar pb-2">
          {data.images.backdrops?.map((img, i) => (
            <img
              key={i}
              alt={data.title}
              src={`https://image.tmdb.org/t/p/w533_and_h300_multi_faces${img.file_path}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Film;
