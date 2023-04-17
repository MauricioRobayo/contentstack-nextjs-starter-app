import React, { useState, useEffect } from "react";
import { onEntryChange } from "../contentstack-sdk";
import RenderComponents from "../components/render-components";
import { getPageRes } from "../helper";
import Skeleton from "react-loading-skeleton";
import { Props } from "../typescript/pages";
import { GetStaticPaths, GetStaticProps } from "next";

export default function Page(props: Props & { time: number }) {
  const { page, entryUrl } = props;
  const [getEntry, setEntry] = useState(page);
  console.log("time from server", props.time);
  async function fetchData() {
    try {
      const entryRes = await getPageRes(entryUrl);
      if (!entryRes) throw new Error("Status code 404");
      setEntry(entryRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [page]);

  return getEntry.page_components ? (
    <>
      <RenderComponents
        pageComponents={getEntry.page_components}
        contentTypeUid="page"
        entryUid={getEntry.uid}
        locale={getEntry.locale}
      />
    </>
  ) : (
    <Skeleton count={3} height={300} />
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  try {
    const entryUrl = params.page.includes("/")
      ? params.page
      : `/${params.page}`;
    const entryRes = await getPageRes(entryUrl);
    if (!entryRes) throw new Error("404");
    return {
      props: {
        entryUrl: entryUrl,
        page: entryRes,
        time: Date.now(),
      },
      revalidate: 1,
    };
  } catch (error) {
    return { notFound: true };
  }
};

// export async function getServerSideProps({params}: any) {
//   try {
//       const entryUrl = params.page.includes('/') ? params.page:`/${params.page}`
//       const entryRes = await getPageRes(entryUrl);
//       if (!entryRes) throw new Error('404');
//       return {
//         props: {
//           entryUrl: entryUrl,
//           page: entryRes,
//         },
//       };

//   } catch (error) {
//     return { notFound: true };
//   }
// }
