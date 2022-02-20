import prisma from '../../lib/prisma'
import { validateRoute } from '../../lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse, user) => {
    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      orderBy: {
        name: 'asc',
      },
    })

    res.status(200).json(playlists)
  }
)
