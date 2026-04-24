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

  const triggerCls =
    "whitespace-normal text-center leading-tight text-[11px] sm:text-sm py-2 h-auto"

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:max-w-lg h-auto gap-1">
        <TabsTrigger value="wizard" className={triggerCls}>
          Guided Interview
        </TabsTrigger>
        <TabsTrigger value="freeform" className={triggerCls}>
          Describe in Words
        </TabsTrigger>
        <TabsTrigger value="structured" className={triggerCls}>
          Technical Editor
        </TabsTrigger>
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
