import formatDuration from 'format-duration'

export const formatTime = (seconds = 0) => {
  return formatDuration(seconds * 1000)
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
