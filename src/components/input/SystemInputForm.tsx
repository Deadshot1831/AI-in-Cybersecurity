import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSystemStore } from "@/stores/useSystemStore"
import { FreeformInput } from "./FreeformInput"
import { StructuredInput } from "./StructuredInput"

export function SystemInputForm() {
  const { inputMode, setInputMode } = useSystemStore()

  return (
    <Tabs
      value={inputMode}
      onValueChange={(v) => setInputMode(v as "freeform" | "structured")}
    >
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="freeform">Freeform Description</TabsTrigger>
        <TabsTrigger value="structured">Structured Input</TabsTrigger>
      </TabsList>
      <TabsContent value="freeform" className="mt-6">
        <FreeformInput />
      </TabsContent>
      <TabsContent value="structured" className="mt-6">
        <StructuredInput />
      </TabsContent>
    </Tabs>
  )
}
