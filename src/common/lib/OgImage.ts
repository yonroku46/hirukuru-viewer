import { config } from "@/config";
import { createHmac } from "crypto";
import urlJoin from "url-join";

// シークレットはURLの署名と検証に使用され、サービスの不正使用を防ぐために使用される
const secret = config.ogImageSecret;

export interface OpenGraphImageParams {
  title: string;
  label?: string;
  brand?: string;
}

export const signOgImageParams = ({
  title,
  label,
  brand,
}: OpenGraphImageParams) => {
  const valueString = `${title}.${label}.${brand}`;
  const signature = createHmac("sha256", secret)
    .update(valueString)
    .digest("hex");
  return { valueString, signature };
};

export const verifyOgImageSignature = (
  params: OpenGraphImageParams,
  signature: string
) => {
  const { signature: expectedSignature } = signOgImageParams(params);
  return expectedSignature === signature;
};

export const signOgImageUrl = (param: OpenGraphImageParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("title", param.title);
  if (param.label) {
    queryParams.append("label", param.label);
  }
  if (param.brand) {
    queryParams.append("brand", param.brand);
  }
  const { signature } = signOgImageParams(param);
  queryParams.append("s", signature);
  return urlJoin(config.baseUrl, `/api/og-image/?${queryParams.toString()}`);
};
