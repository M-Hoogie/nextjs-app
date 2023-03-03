import styles from "@/styles/Home.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function SiteOwner() {
  const { data: session } = useSession();
  const [isSiteOwner, setIsSiteOwner] = useState<Boolean>(false);
  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_BLUEKNOWS_BACKEND!}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          query: `{
          me {
            permissions
          }
        }`,
        }),
      })
        .then((res) => res.json())
        .then(({ data }) => {
          if (data.me.permissions.includes("USER__CHANGE_ACCESS")) {
            setIsSiteOwner(true);
          }
        });
    }
  }, [session]);

  return isSiteOwner ? (
    <code className={styles.code}>Is Site owner</code>
  ) : (
    <code>Not site owner</code>
  );
}
