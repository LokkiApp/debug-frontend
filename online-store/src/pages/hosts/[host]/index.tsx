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
import styled from "@emotion/styled";
import { Planet, prefetchCurrentPlanet, useCurrentPlanet } from "utils/planet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const __DEV__ = process.env.NODE_ENV !== "production";

const Box = styled.div(() => ({
  background: "white",
  boxShadow: "0px 8px 24px rgba(15, 21, 84, 0.05)",
  borderRadius: "12px",
}));

interface ResidentCardProps {
  title: string;
  imageUrl: string;
  onClick?: () => void;
}
function ResidentCard({ title, imageUrl, onClick }: ResidentCardProps) {
  return (
    <div
      onClick={onClick}
      css={() => ({
        height: 296,
        position: "relative",
        borderRadius: "12px",
        cursor: "pointer",
        boxShadow: "0 0 30px rgb(48 35 173 / 12%)",
        transition: "all .25s ease",
        "&:hover": {
          boxShadow: "0 0 20px rgb(48 35 173 / 16%)",
          transform: "scale(1.01)",
        },
      })}
    >
      <span css={() => ({ color: "black"})}>{title}</span>

      <div
        css={() => ({
          backgroundSize: "cover",
          borderRadius: "12px",
          height: "100%",
          width: "100%",
          backgroundPosition: "50%",
          backgroundImage: `linear-gradient(rgba(250, 250, 255, 0.28) 0%, rgba(28, 28, 28, 0.4) 88.54%), url(${imageUrl})`,
        })}
      />
    </div>
  );
}

function Residents({ planet }: { planet: Planet }) {
  const router = useRouter();
  const { t } = useTranslation(["home", "common"]);

  const isLocalhost =
    typeof window !== "undefined" ? window?.location.hostname === "localhost" : false;

  return (
    <>
      <h2
          css={() => ({
            fontSize: 26,
            textAlign: "center",
            [constants.breakpoints.lg]: {
              textAlign: "left",
            },
            fontWeight: 500,
          })}
          id="planet"
        >
          {t("home:residentsTitle")}
      </h2>
      <Box
        css={{
          marginTop: 24,
          padding: 28,
        }}
      >
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridGap: 28,
            [constants.breakpoints.md]: {
              gridTemplateColumns: "1fr 1fr",
            },
            flex: 1,
          }}
        >
          {planet.residents.map((u, i) => {
            const id = u.split("/").filter(t => t).at(-1);
            if (!id) return null;
            return (
              <ResidentCard
                title={`Resident ${id}`}
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg"
                key={`test-${i}`}
                onClick={() => {
                  {
                    router.push(
                      `${isLocalhost ? router.query.host : "/"}${
                        id ? `?resident=${encodeURI(id)}` : ""
                      }`,
                      `${isLocalhost ? router.query.host : "/"}${
                        id ? `?resident=${encodeURI(id)}` : ""
                      }`,
                      { shallow: true }
                    );
                  }
                }}
              />
            )})
          }
        </div>
      </Box>
    </>
  );
}

export default function Home() {
  const { t } = useTranslation(["home", "common"]);
  const { data } = useCurrentPlanet()
  const router = useRouter();
  const { resident } = router.query;
  const isLocalhost =
    typeof window !== "undefined" ? window?.location.hostname === "localhost" : false;

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

      <div css={({
        display: "flex",
        justifyContent: "space-evenly",
        paddingTop: "20px"
      })}>
        <h1>{t("home:title")}</h1>
        <button
          onClick={() => {
            router.push(
              `${isLocalhost ? router.query.host : ""}/second-page${resident ? `?resident=${encodeURI(resident as string)}` : ""}`
            );
          }}
        >{t("home:button")}</button>
      </div>
      <div
        css={() => ({
          backgroundColor: constants.colors.mercureGray,
          padding: "20px",
          [constants.breakpoints.md]: {
            padding: "20px 40px",
          },
        })}
      >
        <div
          id="Residents"
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 40,
            [constants.breakpoints.md]: {
              justifyContent: "flex-start",
            },
          }}
        />
        { data ? (<Residents planet={data}  />) : null}
      </div>
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
        "home",
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
