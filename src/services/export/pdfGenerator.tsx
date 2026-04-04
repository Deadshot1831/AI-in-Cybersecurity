import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"
import type { LinkedInSlide } from "@/types/export"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0f172a",
    padding: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  slideNumber: {
    position: "absolute",
    top: 30,
    right: 40,
    color: "#64748b",
    fontSize: 14,
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    lineHeight: 1.3,
  },
  bullet: {
    color: "#cbd5e1",
    fontSize: 20,
    marginBottom: 16,
    lineHeight: 1.5,
    paddingLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
  },
  accentBar: {
    width: 60,
    height: 4,
    backgroundColor: "#3b82f6",
    marginBottom: 24,
  },
})

interface CarouselProps {
  slides: LinkedInSlide[]
}

function CarouselDocument({ slides }: CarouselProps) {
  return (
    <Document>
      {slides.map((slide) => (
        <Page
          key={slide.slideNumber}
          size={[1080, 1080]}
          style={styles.page}
        >
          <Text style={styles.slideNumber}>
            {slide.slideNumber}/{slides.length}
          </Text>
          <View style={styles.accentBar} />
          <Text style={styles.title}>{slide.title}</Text>
          {slide.bullets.map((bullet, i) => (
            <Text key={i} style={styles.bullet}>
              {bullet}
            </Text>
          ))}
          {slide.footer && (
            <Text style={styles.footer}>{slide.footer}</Text>
          )}
        </Page>
      ))}
    </Document>
  )
}

export async function generateCarouselPdf(
  slides: LinkedInSlide[]
): Promise<Blob> {
  const blob = await pdf(<CarouselDocument slides={slides} />).toBlob()
  return blob
}
