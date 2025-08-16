export interface RadioStatus {
  avatar?: string
  locutor: string
  programa: string
  unicos: number
  quarto?: string
  quarto_id?: string
}

export interface HabboUser {
  avatar?: string
  nickname?: string
  [key: string]: any
}
