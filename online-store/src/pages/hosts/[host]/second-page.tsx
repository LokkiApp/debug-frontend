import { GetStaticPropsContext } from "next";
import { QueryClient } from "react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { dehydrate } from "react-query/hydration";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { css, Global } from "@emotion/react";
import React from "react";
import { useRouter } from "next/router";
import { constants } from "utils/constants";
import { prefetchCurrentPlanet, useCurrentPlanet } from "utils/planet";
import { useResidentById } from "utils/resident";

const __DEV__ = process.env.NODE_ENV !== "production";

export default function Home() {
  const { t } = useTranslation(["secondPage", "common"]);
  const { data } = useCurrentPlanet();
  const router = useRouter();
  const { resident } = router.query;
  const { data: residentData, isLoading: isResidentLoading } = useResidentById(resident as string);

  return (
    <>
      <Global
        styles={() => css`
          *,
          *::before,
          *::after {
            font-family: Rubik, sans-serif;
          }
        `}
      />
      <Head>
        <title>TEST</title>
        <meta name="description" content="Lokki" />
      </Head>

      <h1>{t("secondPage:title")}</h1>
      <h2>{`${t("secondPage:welcome")} ${data?.name}`}</h2>
      <p>
        {
          resident ? `${isResidentLoading ? resident : residentData?.name} ${t("secondPage:guide")}` : t("secondPage:yourself")
        }
      </p>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const queryClient = new QueryClient();
  const { params, locale } = context;

  if (typeof params?.host !== "string") {
    return { notFound: true };
  }

  try {
    await prefetchCurrentPlanet(queryClient, params.host);
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "secondPage",
      ])),
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
