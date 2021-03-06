/* eslint-env jest */
/* global jasmine */
import fs from 'fs-extra'
import { join } from 'path'
import { nextBuild } from 'next-test-utils'
import { SERVER_PROPS_SSG_CONFLICT } from 'next/dist/lib/constants'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 1
const appDir = join(__dirname, '..')
const indexPage = join(appDir, 'pages/index.js')
const indexPageAlt = `${indexPage}.alt`
const indexPageBak = `${indexPage}.bak`

describe('Mixed getStaticProps and getServerProps error', () => {
  it('should error when exporting both getStaticProps and getServerProps', async () => {
    const { stderr } = await nextBuild(appDir, [], { stderr: true })
    expect(stderr).toContain(SERVER_PROPS_SSG_CONFLICT)
  })

  it('should error when exporting both getStaticPaths and getServerProps', async () => {
    await fs.move(indexPage, indexPageBak)
    await fs.move(indexPageAlt, indexPage)

    const { stderr, code } = await nextBuild(appDir, [], { stderr: true })

    await fs.move(indexPage, indexPageAlt)
    await fs.move(indexPageBak, indexPage)

    expect(code).toBe(1)
    expect(stderr).toContain(SERVER_PROPS_SSG_CONFLICT)
  })
})
