//import {} from '@chakra-ui/layout'
import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react'
import ReactHowler from 'react-howler'
import { useEffect, useState, useRef, FC } from 'react'
import {
  MdShuffle,
  MdPreview,
  MdSkipPrevious,
  MdOutlinePlayCircleFilled,
  MdOutlineRepeat,
  MdOutlinePauseCircleFilled,
  MdSkipNext,
} from 'react-icons/md'
import { useStoreActions } from 'easy-peasy'
import { Song } from '@prisma/client'
import { formatTime } from '../lib/formatters'

interface Props {
  songs: Song[]
  activeSong: Song
}

const Player: FC<Props> = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true)
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id)
  )
  const [seek, setSeek] = useState(0.0)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [duration, setDuration] = useState(0.0)
  const [isSeeking, setIsSeeking] = useState(false)
  const soundRef = useRef(null)
  const repeatRef = useRef(repeat)
  const changeActiveSong = useStoreActions(
    (state: any) => state.changeActiveSong
  )

  const setPlaySate = (value: boolean) => {
    setPlaying(value)
  }

  const onShuffle = () => {
    setShuffle((prev) => !prev)
  }

  const onRepeat = () => {
    setRepeat((prev) => !prev)
  }

  const prevSong = () => {
    setIndex((prev) => {
      return prev ? prev - 1 : songs.length - 1
    })
  }
  const nextSong = () => {
    setIndex((prev) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length)
        if (next === prev) {
          return nextSong()
        }
        return next
      } else {
        return prev === songs.length - 1 ? 0 : prev + 1
      }
    })
  }

  const onEnd = () => {
    if (repeatRef.current) {
      setSeek(0)
      soundRef.current.seek(0)
    } else {
      nextSong()
    }
  }

  const onLoad = () => {
    const songDuration = soundRef.current.duration()
    setDuration(songDuration)
  }
  const onSeek = (e: any) => {
    setSeek(parseFloat(e[0]))
    soundRef.current.seek(e[0])
  }

  useEffect(() => {
    let timerId
    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek())
        timerId = requestAnimationFrame(f)
      }
      timerId = requestAnimationFrame(f)
      return () => {
        cancelAnimationFrame(timerId)
      }
    } else {
      cancelAnimationFrame(timerId)
    }
  }, [playing, isSeeking])

  useEffect(() => {
    changeActiveSong(songs[index])
  }, [index, changeActiveSong, songs])

  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  return (
    <Box>
      <Box>
        <ReactHowler
          playing={playing}
          src={activeSong?.url}
          ref={soundRef}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            sx={{ ':focus': { boxShadow: 'none' } }}
            outline="none"
            variant="link"
            aria-label="shuffle"
            fontSize="24px"
            icon={<MdShuffle />}
            color={shuffle ? 'white' : 'gray.600'}
            onClick={onShuffle}
          />

          <IconButton
            sx={{ ':focus': { boxShadow: 'none' } }}
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="skipPrev"
            fontSize="24px"
            onClick={prevSong}
            icon={<MdSkipPrevious />}
          />
          {playing ? (
            <IconButton
              sx={{ ':focus': { boxShadow: 'none' } }}
              outline="none"
              variant="link"
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlaySate(false)}
            />
          ) : (
            <IconButton
              sx={{ ':focus': { boxShadow: 'none' } }}
              outline="none"
              variant="link"
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlaySate(true)}
            />
          )}

          <IconButton
            sx={{ ':focus': { boxShadow: 'none' } }}
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="next"
            fontSize="24px"
            onClick={nextSong}
            icon={<MdSkipNext />}
          />
          <IconButton
            sx={{ ':focus': { boxShadow: 'none' } }}
            boxShadow="none"
            outline="none"
            variant="link"
            color={repeat ? 'white' : 'gray.600'}
            aria-label="repeat"
            fontSize="24px"
            onClick={onRepeat}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>
      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">{formatTime(seek)}</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={['min', 'max']}
              step={0.1}
              min={0}
              max={duration ? parseFloat(duration.toFixed(2)) : 0}
              onChange={onSeek}
              id="player-range"
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default Player
