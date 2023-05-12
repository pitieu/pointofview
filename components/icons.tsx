import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  robot: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512.000000pt"
      height="512.000000pt"
      viewBox="0 0 512.000000 512.000000"
      {...props}
    >
      <g
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="#FFFFFF"
        stroke="none"
      >
        <path
          d="M2450 4916 c-69 -19 -128 -53 -182 -104 -176 -164 -183 -431 -17
-607 27 -29 65 -60 84 -71 l35 -19 0 -137 0 -137 -462 -3 c-449 -3 -464 -4
-509 -24 -99 -46 -160 -127 -181 -244 l-12 -60 -136 0 c-120 0 -139 -2 -153
-18 -15 -17 -17 -67 -17 -520 l0 -501 26 -20 c24 -19 40 -21 155 -21 l128 0 6
-47 c15 -104 78 -193 169 -241 l51 -27 288 -3 287 -3 0 -104 0 -104 -432 -3
-433 -3 -63 -29 c-67 -31 -117 -79 -154 -148 l-23 -43 -3 -722 c-2 -714 -2
-723 18 -743 20 -20 27 -20 1640 -20 1613 0 1620 0 1640 20 20 20 20 29 18
743 l-3 722 -23 43 c-53 99 -130 155 -239 172 -32 6 -235 10 -450 10 l-393 0
0 104 0 105 288 3 287 3 51 27 c92 49 149 132 170 251 l6 37 128 0 c114 0 130
2 154 21 l26 20 0 503 c0 475 -1 504 -18 519 -15 14 -42 17 -154 17 l-134 0
-12 60 c-21 113 -77 191 -170 237 l-57 28 -462 3 -463 3 0 137 0 137 35 19
c19 11 58 43 86 73 156 165 156 421 0 586 -109 115 -275 163 -421 123z m201
-142 c74 -22 161 -109 183 -185 34 -114 11 -205 -73 -290 -85 -85 -176 -107
-291 -73 -75 22 -162 109 -184 184 -28 95 -17 172 36 250 40 59 80 90 142 112
64 22 117 22 187 2z m-41 -819 l0 -115 -50 0 -50 0 0 115 0 115 50 0 50 0 0
-115z m1053 -269 c42 -17 83 -66 97 -114 14 -50 14 -1144 0 -1194 -14 -48 -55
-97 -97 -114 -27 -12 -221 -14 -1102 -14 -733 0 -1079 3 -1098 11 -40 15 -73
48 -94 94 -17 37 -19 77 -19 610 0 362 4 584 10 607 13 47 55 97 95 114 45 20
2161 20 2208 0z m-2453 -716 l0 -400 -85 0 -85 0 0 400 0 400 85 0 85 0 0
-400z m2870 0 l0 -400 -85 0 -85 0 0 400 0 400 85 0 85 0 0 -400z m-1110 -965
l0 -105 -410 0 -410 0 0 105 0 105 410 0 410 0 0 -105z m974 -255 c45 -10 81
-34 110 -74 21 -27 21 -39 24 -687 l2 -659 -275 0 -275 0 0 335 0 336 -25 24
-24 25 -921 0 -921 0 -24 -25 -25 -24 0 -336 0 -335 -275 0 -275 0 2 659 c3
648 3 660 24 687 28 39 66 65 105 74 48 11 2725 12 2773 0z m-554 -1130 l0
-290 -830 0 -830 0 0 290 0 290 830 0 830 0 0 -290z"
        />
        <path
          d="M1797 3426 c-175 -65 -254 -263 -172 -431 109 -225 441 -222 552 3
38 78 40 193 4 266 -30 60 -86 118 -143 147 -54 28 -184 36 -241 15z m206
-159 c126 -96 55 -302 -104 -300 -120 2 -198 115 -155 227 29 76 83 109 168
103 42 -2 65 -10 91 -30z"
        />
        <path
          d="M3117 3426 c-175 -65 -254 -263 -172 -431 109 -225 441 -222 552 3
38 78 40 193 4 266 -30 60 -86 118 -143 147 -54 28 -184 36 -241 15z m202
-156 c39 -27 71 -90 71 -140 0 -41 -34 -105 -71 -132 -68 -50 -160 -41 -221
23 -76 80 -56 208 42 261 48 26 134 21 179 -12z"
        />
        <path
          d="M2097 2572 c-24 -26 -21 -75 4 -98 20 -18 42 -19 459 -19 417 0 439
1 459 19 26 24 28 77 3 99 -17 15 -64 17 -464 17 -418 0 -446 -1 -461 -18z"
        />
        <path
          d="M1286 1648 c-155 -33 -197 -237 -70 -335 29 -21 50 -28 99 -31 81 -5
135 22 173 87 84 143 -40 313 -202 279z m85 -159 c17 -33 -3 -69 -39 -69 -33
0 -52 16 -52 45 0 29 19 45 52 45 18 0 31 -7 39 -21z"
        />
        <path
          d="M3693 1625 c-47 -28 -93 -108 -93 -160 0 -54 47 -132 96 -161 38 -23
54 -26 108 -22 50 3 71 10 100 31 101 77 101 227 0 304 -30 22 -49 28 -103 31
-57 2 -72 -1 -108 -23z m135 -127 c7 -7 12 -21 12 -33 0 -29 -19 -45 -52 -45
-36 0 -56 36 -39 69 13 23 59 29 79 9z"
        />
      </g>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="705.6"
      height="720"
      viewBox="0 0 186.69 190.5"
      {...props}
    >
      <g transform="translate(1184.583 765.171)">
        <path
          mask="none"
          d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
          fill="#4285f4"
        />
        <path
          mask="none"
          d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
          fill="#34a853"
        />
        <path
          mask="none"
          d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
          fill="#fbbc05"
        />
        <path
          d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
          fill="#ea4335"
          mask="none"
        />
      </g>
    </svg>
  ),
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  twitter: Twitter,
  check: Check,
}

export const editorjsTools = {
  paragraph:
    '<svg width="17" height="15" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" ><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M4618.4,4986.9c-859.8-151.7-1394.2-655.3-1550.3-1460.2c-112.2-578.3,79.2-1106.1,578.4-1603.1l206.7-202.3l-83.6-44c-162.7-83.6-409-272.7-576.1-442c-178.1-180.3-277.1-329.9-373.8-554.2c-50.6-125.3-57.2-164.9-57.2-413.4c0-230.9,8.8-299.1,52.8-428.8c233.1-697.1,923.6-1403,2245.2-2298c417.8-283.7,611.3-466.2,708.1-672.9c136.3-292.5,101.2-521.2-112.2-736.7c-175.9-173.7-318.9-228.7-606.9-228.7c-193.5,0-235.3,6.6-345.2,59.4c-134.1,61.6-336.5,235.3-358.4,305.6c-8.8,24.2,11,92.4,44,162.7c116.5,235.3,68.2,530-116.5,723.5c-244.1,252.9-666.3,255.1-912.6,2.2c-127.6-132-169.3-244.1-169.3-464c0-230.9,44-411.2,147.3-609.1c255.1-486,958.8-873,1587.7-873c983,0,1671.3,446.4,1935.2,1251.3c151.7,464,105.5,952.2-129.8,1354.6c-118.8,197.9-211.1,314.5-422.2,519L6138-1498l180.3,112.1c457.4,279.3,771.8,653.1,886.2,1046.7c59.4,206.7,37.4,541-55,787.3c-248.5,677.3-932.4,1365.6-2221,2238.6c-417.8,281.5-580.5,439.8-694.9,672.9c-79.2,158.3-85.8,184.7-85.8,358.4c0,142.9,11,206.7,39.6,263.9c211.1,382.6,736.7,512.4,1123.7,272.7c103.3-63.8,237.5-186.9,303.5-277.1l41.8-59.4L5597,3795c-114.4-235.3-66-527.8,118.7-719.1c123.2-127.5,230.9-175.9,424.4-186.9c145.2-8.8,184.7-2.2,288.1,44c142.9,66,261.7,182.5,325.4,321.1c44,92.4,48.4,127.5,37.4,334.3c-13.2,296.9-70.4,479.4-219.9,699.3c-202.3,294.7-523.4,519-939,655.3c-164.9,52.8-226.5,61.6-516.8,66C4910.9,5013.3,4721.8,5004.5,4618.4,4986.9z M4660.2,1193.6c299.1-175.9,741.1-481.6,978.6-677.3c301.3-246.3,475-499.2,521.2-760.8c48.4-255.1-81.4-536.6-340.9-747.7c-72.6-57.2-153.9-110-180.3-116.6c-59.4-15.4-426.6,197.9-853.2,497c-389.2,272.7-573.9,426.6-710.3,591.5c-391.4,470.6-329.9,941.2,169.3,1297.4c52.8,37.4,110,68.2,127.5,68.2C4389.7,1345.3,4519.5,1277.1,4660.2,1193.6z" /></g></svg>',
}
