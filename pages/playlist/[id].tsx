import { FC } from 'react'
import GradientLayout from '../../components/GradientLayout'
import SongTable from '../../components/SongsTable'
import { validateToken } from '../../lib/auth'
import prisma from '../../lib/prisma'

interface Props {
  playlist: any
}

const getBgcolor = (id) => {
  const colors = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'gray',
    'teal',
    'yellow',
  ]
  const index = (id - 1) % colors.length
  return colors[index]
}

const Playlist: FC<Props> = ({ playlist }) => {
  const color = getBgcolor(playlist.id)
  return (
    <GradientLayout
      roundImage={false}
      title={playlist.name}
      description={`${playlist.songs.length} songs`}
      subtitle="playlist"
      color={color}
      image={`https://picsum.photos/400?random=${playlist.id}`}
    >
      <SongTable songs={playlist.songs} />
    </GradientLayout>
  )
}

export const getServerSideProps = async ({ query, req }) => {
  let user
  try {
    user = validateToken(req.cookies.CUP_ACCESS_TOKEN)
    const [playlist] = await prisma.playlist.findMany({
      where: { id: +query.id, userId: user.id },
      include: {
        songs: {
          include: {
            artist: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    })
    return {
      props: { playlist },
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        permanent: false,
        destination: 'signin',
      },
    }
  }
}

export default Playlist
