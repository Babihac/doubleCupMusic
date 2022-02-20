import { FC } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import Player from './Player'
import { useStoreState } from 'easy-peasy'

const PlayerBar: FC = () => {
  const songs = useStoreState((state: any) => state.activeSongs)
  const song = useStoreState((state: any) => state.activeSong)
  console.log('SONG', song)
  return (
    <Box height="100px" bg="gray.900" padding="10px" width="100vw">
      <Flex align="center">
        {song ? (
          <Box padding="20px" color="white" width="30%">
            <Text fontSize="large">{song.name}</Text>
            <Text fontSize="small">{song?.artist?.name}</Text>
          </Box>
        ) : null}
        <Box width="40%">
          {song ? <Player songs={songs} activeSong={song} /> : null}
        </Box>
      </Flex>
    </Box>
  )
}

export default PlayerBar
