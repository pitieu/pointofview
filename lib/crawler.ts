import * as cheerio from "cheerio"
import axios from "axios"
import { removeExtraSpaces, summarizeChunks } from "@/utils/string"
import { CreateCompletionRequest } from "openai"

export const crawlUrl = async (url: string) => {
  console.log("Crawling url: ", url)
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  $("script, noscript").remove()
  const result = $("body").text()
  return result
}

export const crawlUrls = async (urls: string[]) => {
  const results = await Promise.all(urls.map((url) => crawlUrl(url)))
  return results
}

export const crawlAndSummarizeUrls = async ({
  urls,
  maxChunkSize = 17000, // by default will not chunk the text
  minOutputSize = 3000,
  summarizer,
}: {
  urls: string[]
  maxChunkSize?: number
  minOutputSize?: number
  summarizer?: (content: string) => Promise<string | undefined>
}) => {
  const results = [
    "Skip to content Language Selector ID Hubungi Kami Pendaftaran Buletin Produk 101ManfaatJelly The Healing Project Artikel Siapa Kami Kategori Semua Produk Healing jelly Lotions and moisturizers Sun protection Face care Lip care Hand and body care produk unggulan Vaseline Men Active Bright Oil Expert Gel Wash Vaseline® Intensive Care™ Aloe Soothe Lotion Vaseline® Petroleum Jelly 101 Manfaat Jelly Healing Project Kategori Semua Artikel Tipe Kulit Perawatan Tubuh Skin Fundamentals Produk Artikel Trending Tips Praktis Membersihkan Wajah untuk Pria Modern Perawatan Kulit untuk Ibu dan Bayi Kondisi Kulit dapat Menjelaskan Berapa Usia Anda Siapa Kami Search go Home Semua Produk Lotions and moisturizers Vaseline Healthy Bright UV Extra Brightening Lotion Vaseline Healthy Bright UV Extra Brightening Lotion Vaseline® Healthy Bright UV Extra Brightening Lotion- 100ML. Read reviews Have a question? Perlindungan ekstra untuk kulit cerah dalam 3 hari dengan glutaglow Select a size: 100ML 200ML 400ML Beli sekarang Vaseline® Healthy Bright UV Extra Brightening Lotion- 200ML. Read reviews Have a question? Perlindungan ekstra untuk kulit cerah dalam 3 hari dengan glutaglow Select a size: 100ML 200ML 400ML Beli sekarang Vaseline® Healthy Bright UV Extra Brightening Lotion- 400ML. Read reviews Have a question? Perlindungan ekstra untuk kulit cerah dalam 3 hari dengan glutaglow Select a size: 100ML 200ML 400ML Beli sekarang tentang produk cara pakai daftar bahan Diperkaya dengan Vitamin B3 alami, yang membantu kulit tampak lebih cerah dengan cara menghambat produksi melanin. Triple sunscreens mencegah terjadinya penggelapan kulit dan kerusakan lebih lanjut. Meresap cepat tanpa rasa lengket. Keluarkan lotion di tangan secukupnya, aplikasikan pada seluruh permukaan kulit tubuh. Gunakan dua kali sehari untuk hasil maksimal. Water, Isopropyl Myristate, Stearic Acid, Glyceryl Stearate, Mineral Oil, Ethylhexyl Methoxycinnamate, Niacinamide, Glycerin, Petrolatum, Butyl Methoxydibenzoylmethane, Tocopheryl Acetate, Sodium Ascorbyl Phosphate, Titanium Dioxide, Dimethicone, Triethanolamine, Carbomer, Perfume, Cetyl Alcohol, Disodium EDTA, Hydrated Silica, Aluminum Hydroxide, Alginic Acid, Phenoxyethanol, Methylparaben, Propylparaben, BHT Related Articles Cara Praktis Mencegah dan Mengatasi Iritasi Kulit Jangan sepelekan iritasi kulit yang bisa mengganggu kesehatan serta penampilan Anda. Kenali cara mencegah dan mengatasinya secara cermat dari sekarang. Read about Read more » Efektifkah Kosmetik dengan SPF untuk Menangkal Sinar UV? Efektifkah Kosmetik dengan SPF untuk Menangkal Sinar UV? Read about Read more » Jangan Abaikan Perawatan Kulit Selama Liburan Jangan Abaikan Perawatan Kulit saat Liburan Read about Read more » Dapatkan 6 Manfaat Ini dari Matahari Pagi Berikut enam manfaat berjemur di bawah matahari pagi dan Anda akan semakin yakin untuk tidak melewatkannya lagi. Read about Read more » You may also like Vaseline® Intensive Care™ Healthy Sunblock SPF30 Lotion SPF 30 yang water resistant untuk kulit tampak sehat dan terlindungi dari sinar matahari Quick view Vaseline® Intensive Care™ Advanced Strength Lotion Terbukti secara klinis memperbaiki kulit yang sangat kering dalam 5 hari* Quick view Vaseline® Intensive Care™ Aloe Soothe Lotion Terbukti secara klinis melembabkan sampai ke dalam* untuk memperbaiki dan menyegarkan kulit kering hingga 24 jam** *Di dalam stratum corneum **Berdasarkan uji klinis, dengan pemakaian teratur Quick view Vaseline® Healing Project bekerja sama dengan Direct Relief menyediakan perawatan dermatologis, Vaseline® Jelly, & persediaan medis untuk membantu mengobati masalah kulit pada orang-orang yang terdampak oleh kemiskinan dan keadaan darurat di seluruh dunia. PELAJARI SELENGKAPNYA Page footer Site Map Pertanyaan Umum Hubungi Kami Pendaftaran Buletin Aksesibilitas Ketentuan Penggunaan Pemberitahuan Privasi Pemberitahuan Cookie Call Us 0-800-1-558000 Facebook YouTube Instagram © 2022 Unilever. Semua hak dilindungi undang-undang. Country Selector Brazil (PT) Canada (EN) Canada (FR) India (EN) Indonesia (ID) Malaysia (EN) Netherlands (NL) South Africa (EN) Thailand (TH) United Arab Emirates (EN) United States (EN) United States (ES)  ---",
  ]
  // const results = await crawlUrls(urls)
  const normalizedText = removeExtraSpaces(results.join(" ")) // reduces the size of the text
  const summarizedText = await summarizeChunks(
    normalizedText,
    maxChunkSize,
    minOutputSize,
    summarizer
  )
  return summarizedText
}

/**
 * Crawls a url and returns the visible text summarized.
 * @param text The text to summarize.
 * @param maxChunkSize The maximum size of the input text.
 * @param minOutputSize The minimum size of the output text.
//  */
export const summarizeUrlText = async (
  url: string,
  maxChunkSize: number = 3000,
  minOutputSize: number = 3000
): Promise<string> => {
  try {
    const visibleText = await crawlUrl(url)
    const normalizedText = removeExtraSpaces(visibleText as string) // reduces the size of the text
    const summarizedText = await summarizeChunks(
      normalizedText,
      maxChunkSize,
      minOutputSize
    )
    return summarizedText
  } catch (e) {
    throw new Error("Error while crawling the url")
  }
}
