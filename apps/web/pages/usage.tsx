import Item from "components/Item"
import Layout from "components/Layout"
import Options from "components/Options"
import { useState } from "react"
import { getItems, QueryFilter } from "./api/usage"
import useSWR from "swr"

const fetcher = (input, init?) => fetch(input, init).then(res => res.json())

const PDAs = ['TF_WEAPON_PDA_SPY', 'TF_WEAPON_BUILDER', 'TF_WEAPON_PDA_ENGINEER_DESTROY', 'TF_WEAPON_PDA_ENGINEER_BUILD']

const optionsToString = (options) => {
  let query = '?'

  for (const key in options) {
    query += key + '=' + options[key] + '&'
  }

  return query.slice(0, -1)
}

export default function MainPage({initialItems, initialOptions}) {
  const [options, setOptions] = useState(initialOptions)
  const { data, error } = useSWR(`/api/usage${optionsToString(options)}`, fetcher)

  const items = data || initialItems

  return (
    <Layout>
      <div className="flex flex-col divide-y-[1px] items-center divide-slate-500">
        <Options options={options} setOptions={setOptions} />
        <div className="space-y-3 pt-4">
          {
            items.filter((item) => !(options.ignorePDAs && PDAs.includes(item.name))).map((item, index) => (
              <Item {...item} rank={index + 1} key={item.defindex} />
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const query: QueryFilter = {active: true, minutesThreshold: 120000, class: -1, slot: -1}

  const items = await getItems(query)

  return {
    props: {
      initialItems: items,
      initialOptions: {
        ...query,
        ignorePDAs: true
      }
    },
    revalidate: 3600
  }
}
