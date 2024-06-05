import {format} from 'date-fns'
import {ko} from 'date-fns/locale/ko'

export const getDay = (d: Date) => format(d, 'yyyy.MM.dd(E)', {locale: ko})
