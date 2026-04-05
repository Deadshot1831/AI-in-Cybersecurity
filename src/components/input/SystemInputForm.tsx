import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSystemStore } from "@/stores/useSystemStore"
import { FreeformInput } from "./FreeformInput"
import { StructuredInput } from "./StructuredInput"
import { InterviewWizard } from "./InterviewWizard"

export function SystemInputForm() {
  const { inputMode, setInputMode } = useSystemStore()
  const [activeTab, setActiveTab] = useState<string>(inputMode === "structured" ? "structured" : "freeform")

  const handleTabChange = (v: string) => {
    setActiveTab(v)
    if (v === "freeform") setInputMode("freeform")
    else if (v === "structured") setInputMode("structured")
    // "wizard" keeps inputMode as-is until wizard completes (it sets "structured")
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-3 max-w-lg">
        <TabsTrigger value="wizard">Guided Interview</TabsTrigger>
        <TabsTrigger value="freeform">Describe in Words</TabsTrigger>
        <TabsTrigger value="structured">Technical Editor</TabsTrigger>
      </TabsList>
      <TabsContent value="wizard" className="mt-6">
        <InterviewWizard />
      </TabsContent>
      <TabsContent value="freeform" className="mt-6">
        <FreeformInput />
      </TabsContent>
      <TabsContent value="structured" className="mt-6">
        <StructuredInput />
      </TabsContent>
    </Tabs>
  )
}
