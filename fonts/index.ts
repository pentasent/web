/* Fonts - Google */


import { Jura, Sanchez, Sansita_Swashed, Comfortaa, Noto_Sans, Ubuntu, Open_Sans, Caveat, Inter, Red_Hat_Text } from "next/font/google";


// GOOGLE FONTS DEFINATION
const jura = Jura({ subsets: ['cyrillic'], weight: ["400", "700"], display: 'swap', adjustFontFallback: false, variable: '--font-jura' })
const sanchez = Sanchez({ subsets: ['latin-ext'], weight: ["400"], display: 'swap', adjustFontFallback: false, variable: '--font-sanchez' })
const sansita_swashed = Sansita_Swashed({ subsets: ['latin'], weight: ["400", "800"], display: 'swap', adjustFontFallback: false, variable: '--font-sanchez' })
const comfortaa = Comfortaa({ subsets: ['latin'], weight: ["400", "700"], display: 'swap', adjustFontFallback: false, variable: '--font-sanchez' })
const noto_sans = Noto_Sans({ subsets: ['latin'], weight: ["400", "700"], display: 'swap', adjustFontFallback: false, variable: '--font-sanchez' })
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ["400", '500', '700'], display: 'swap', adjustFontFallback: false, variable: '--font-ubuntu' })
const openSans = Open_Sans({ subsets: ['latin'], weight: ["400"], display: 'swap', adjustFontFallback: false, variable: '--font-openSans' })
const caveat = Caveat({ subsets: ['latin'], weight: ["400", '700'], display: 'swap', adjustFontFallback: false, variable: '--font-caveat' })
const inter = Inter({ subsets: ['latin'], weight: ["400", '700'], display: 'swap', adjustFontFallback: false, variable: '--font-inter' })
const red_hat_text = Red_Hat_Text({ subsets: ['latin'], weight: ["400", '600'], display: 'swap', adjustFontFallback: false, variable: '--font-red_hat_text' })


// expots the google fonts
export const GoogleFonts = { jura, sanchez, sansita_swashed, comfortaa, noto_sans, ubuntu, openSans, caveat, inter, red_hat_text }