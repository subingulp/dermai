// The three-tab shell: Main, Data, Me, with an animated bottom navigation.

import { AnimatePresence, motion } from 'motion/react'
import BottomNav from '../components/BottomNav'
import Screen from '../components/Screen'
import DataTab from './DataTab'
import MainTab from './MainTab'
import MeTab from './MeTab'

const TABS = { main: MainTab, data: DataTab, me: MeTab }

export default function Tabs({ tab, nav }) {
  const Current = TABS[tab]
  return (
    <Screen scroll={false}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className="screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <Current nav={nav} />
        </motion.div>
      </AnimatePresence>
      <BottomNav tab={tab} onChange={nav.setTab} />
    </Screen>
  )
}
