import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)

import { tryParseInt } from "@/libs/result/std"


export default function UnderTheMaintenance({message}: {message?: string}) {
  const remaining_time = message?.match(/\((\d+)sec.\)/)?.[1] || "0"

  const sec = tryParseInt(remaining_time, 10).unwrap_or(0)
  const dur = dayjs.duration(sec, 'seconds').format("H[h] m[m] s[s]")

  return (
    <div>
      <div>
        {/* <img src={OppsImag} className="px-12" /> */}
      </div>

      <h1>The site is currently down for maintenance</h1>

      <div>
        <h3>{message}</h3>
        <h1>Refresh after: {dur}</h1>
      </div>
    </div>
  )
}

