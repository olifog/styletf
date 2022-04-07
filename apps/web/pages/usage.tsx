import Item from "components/Item"
import Layout from "components/Layout"
import Options from "components/Options"
import { useState } from "react"
import { getItems, QueryFilter } from "lib/getItems"
import useSWR, { unstable_serialize } from "swr"
import { SWRConfig } from "swr"
import Head from "next/head"

const fetcher = (url, params) => fetch(`${url}${optionsToString(params)}`).then(res => res.json())

const PDAs = ['TF_WEAPON_PDA_SPY', 'TF_WEAPON_BUILDER', 'TF_WEAPON_PDA_ENGINEER_DESTROY', 'TF_WEAPON_PDA_ENGINEER_BUILD']

const optionsToString = (options) => {
  let query = '?'

  for (const key in options) {
    query += key + '=' + options[key] + '&'
  }

  return query.slice(0, -1)
}

const Usage = ({ initialOptions}) => {
  const [options, setOptions] = useState(initialOptions)
  const { data } = useSWR(['/api/usage', options || initialOptions], fetcher)
  const [ignorePDAs, setIgnorePDAs] = useState(true)

  return (
    <div className="flex flex-col divide-y-[1px] items-center divide-slate-500">
      <Options options={options} setOptions={setOptions} ignorePDAs={ignorePDAs} setIgnorePDAs={setIgnorePDAs} />
      <div className="space-y-6 md:space-y-3 pt-4 w-60 md:w-96">
        { data &&
          data.filter((item) => !(ignorePDAs && PDAs.includes(item.name))).map((item, index) => (
            <Item {...item} rank={index + 1} key={item.defindex} />
          ))
        }
      </div>
    </div>
  )
}

export default function Page({ fallback, initialOptions}) {
  return (
    <SWRConfig value={{ fallback }}>
      <Head>
        <title>Style.tf | Usage rates</title>
      </Head>
      <Layout>
        <Usage initialOptions={initialOptions} />
      </Layout>
    </SWRConfig>
  )
}

export async function getStaticProps(context) {
  const query: QueryFilter = {active: true, minutesThreshold: 120000, class: -1, slot: -1}

  const items = await getItems(query)

  return {
    props: {
      fallback: {
        [unstable_serialize(['/api/usage', query])]: items
      },
      initialOptions: query
    },
    revalidate: 3600
  }
}
