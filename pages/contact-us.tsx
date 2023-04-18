import { InferGetStaticPropsType } from "next";
import { getPageByUid } from "../apollo/client";
import { useEffect } from "react";

const listener = (event: any) => {
  console.log("Message received:", event);
};
export default function GraphQLPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    window.addEventListener("message", listener, false);
    return () => {
      window.removeEventListener("message", listener, false);
    };
  }, []);
  return (
    <div style={{ padding: "1rem" }}>
      {data.page.page_components.map(({ section_with_html_code }: any) => {
        const { title } = section_with_html_code;
        return (
          <div key={title}>
            <h1
              key={title}
              data-cslp="page.bltcd0c9d689bcf0c2a.en-us.page_components.0.section_with_html_code.title"
            >
              {title}
            </h1>
          </div>
        );
      })}
      <details>
        <summary>Data &rarr;</summary>
        <div
          style={{
            backgroundColor: "#222",
            color: "#efefef",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <pre>
            page.bltcd0c9d689bcf0c2a.en-us.page_components.0.section_with_html_code.title
          </pre>
        </div>
      </details>
    </div>
  );
}

export async function getStaticProps() {
  const data = await getPageByUid("bltcd0c9d689bcf0c2a");
  console.log(JSON.stringify(data, null, 2));
  return {
    props: {
      data,
    },
  };
}
