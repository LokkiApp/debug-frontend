import { QueryClient, useQuery } from "react-query";
import { useRouter } from "next/router";

const queryKeys = {
  getPlanetBySlug: (slug: string) => ["planet", slug],
}

export interface Planet {
  name: string;
  climate: string;
  population: string;
  residents: string[];
};

const queryBySlug = async (slug: string): Promise<Planet | null> => {
  const res = await fetch(`https://swapi.dev/api/planets/?search=${slug}`);
  const planetInfo = await res.json() as unknown as { results: Planet[]};

  if (planetInfo.results.length !== 0) {
    return planetInfo.results[0];
  }

  return null;
}
export const prefetchCurrentPlanet = async (
  queryClient: QueryClient,
  host: string
): Promise<Planet | null> => {
  const tokens = host.split(".");
  if (!tokens) {
    throw new Error("no host provided");
  }
  const slug = tokens[0];

  return queryBySlug(slug);
};

export const useCurrentPlanet = () => {
  const { host } = useRouter().query;

  if (typeof host !== "string") {
    throw new Error("host not found");
  }

  const slug = host.split(".")[0];

  return useQuery(queryKeys.getPlanetBySlug(slug), () => queryBySlug(slug), {
    enabled: slug !== null,
  });
}
