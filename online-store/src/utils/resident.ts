import { QueryClient, useQuery } from "react-query";
import { useRouter } from "next/router";

const queryKeys = {
  getResidentById: (id: string) => ["resident", id],
}

export interface Resident {
  name: string;
};

const queryById = async (id: string): Promise<Resident | null> => {
  const res = await fetch(`https://swapi.dev/api/people/${id}`);
  const residentInfo = await res.json() as unknown as Resident;

  return residentInfo;
}

export const useResidentById = (id: string) => {
  return useQuery(queryKeys.getResidentById(id), () => queryById(id), {
    enabled: id !== null,
  });
}
