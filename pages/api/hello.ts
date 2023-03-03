// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const userData = await fetch(
      `${process.env.NEXT_PUBLIC_BLUEKNOWS_BACKEND!}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          query: `{
        me {
          givenName
          familyName
        }
      }`,
        }),
      }
    ).then((res) => res.json());

    const me = userData.data.me;
    console.log(me);

    res.status(200).json({ name: `${me.givenName} ${me.familyName}` });
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
