import { Playlist, User } from '@prisma/client'
import useSWR from 'swr'

type Me = {
  playlistCount: number
} & User
export const useMe = () => {
  const { data, error } = useSWR<Me>('/me')
  return {
    user: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export const usePlaylist = () => {
  const { data, error } = useSWR<Playlist[]>('/playlist')

  return {
    playlists: data,
    isLoading: !data && !error,
    isError: error,
  }
}
