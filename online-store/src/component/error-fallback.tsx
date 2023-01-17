import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import { constants } from "utils/constants";

function ErrorFallback({ error }: { error: Error }) {
  const { t } = useTranslation("common");
  return (
    <div
      css={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        css={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          textAlign: "center",
          color: constants.colors.redDanger,
        }}
      >
        <h2>{t("common:errorFallbackTitle")}</h2>
        <p>{t("common:errorFallbackSubtitle")}</p>
        <pre
          css={{
            border: "5px solid red",
            borderRadius: 10,
            padding: "10px 20px",
            overflow: "scroll",
            maxWidth: "50%",
            maxHeight: "30%",
            backgroundColor: constants.colors.paleWhite,
            marginBottom: 20,
            color: "black",
          }}
        >
          {error.message}
          <br />
          {error.stack}
        </pre>
        <button
          css={{
            cursor: "pointer",
          }}
          onClick={() => navigator.clipboard.writeText(`${error.message}\n${error.stack}`)}
        >
          {t("common:errorFallBackButton")}
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
