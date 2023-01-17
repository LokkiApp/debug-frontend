/// <reference types="@emotion/react/types/css-prop" />
import "@emotion/react";
import { CompanyTheme } from "@lokki/sdk";

declare module "@emotion/react" {
  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends CompanyTheme {}
}
