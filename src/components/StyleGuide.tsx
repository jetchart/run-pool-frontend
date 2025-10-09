"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { Info, AlertCircle, CheckCircle2 } from "lucide-react";

export default function StyleGuide() {
  const sizes = [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
  ];

  const weights = [
    { name: "font-light", label: "Light" },
    { name: "font-normal", label: "Normal" },
    { name: "font-medium", label: "Medium" },
    { name: "font-semibold", label: "Semibold" },
    { name: "font-bold", label: "Bold" },
  ];

  const colors = [
    "text-foreground",
    "text-muted-foreground",
    "text-primary",
    "text-secondary",
    "text-destructive",
  ];

  const buttonVariants = [
    "default",
    "secondary",
    "outline",
    "ghost",
    "link",
    "destructive",
  ];

  const badgeVariants = ["default", "secondary", "outline", "destructive"];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Guía de Estilos - ShadCN + Tailwind</h1>

      <Tabs defaultValue="typography" className="space-y-8">
        {/* Tabs header */}
        <TabsList>
          <TabsTrigger value="typography">Tipografía</TabsTrigger>
          <TabsTrigger value="buttons">Botones</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        {/* Tipografía */}
        <TabsContent value="typography" className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tamaños</h2>
            {sizes.map((size) => (
              <div key={size} className="flex items-center gap-4 mb-2">
                <span className="w-40 font-mono text-sm text-muted-foreground">{size}</span>
                <span className={size}>Texto de ejemplo ({size})</span>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Pesos</h2>
            {weights.map((w) => (
              <div key={w.name} className="flex items-center gap-4 mb-2">
                <span className="w-40 font-mono text-sm text-muted-foreground">{w.name}</span>
                <span className={w.name}>{w.label} weight</span>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Colores</h2>
            {colors.map((c) => (
              <div key={c} className="flex items-center gap-4 mb-2">
                <span className="w-40 font-mono text-sm text-muted-foreground">{c}</span>
                <span className={c}>Ejemplo de texto ({c})</span>
              </div>
            ))}
          </section>
        </TabsContent>

        {/* Botones */}
        <TabsContent value="buttons" className="space-y-3">
          {buttonVariants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-40 font-mono text-sm text-muted-foreground">
                variant="{variant}"
              </span>
              <Button variant={variant as any}>{variant}</Button>
            </div>
          ))}
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="space-y-3">
          {badgeVariants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <span className="w-40 font-mono text-sm text-muted-foreground">
                variant="{variant}"
              </span>
              <Badge variant={variant as any}>{variant}</Badge>
            </div>
          ))}
        </TabsContent>

        {/* Inputs */}
        <TabsContent value="inputs" className="space-y-5">
          <div>
            <label className="block mb-2 font-mono text-sm text-muted-foreground">Input básico</label>
            <Input placeholder="Escribí algo..." />
          </div>

          <div>
            <label className="block mb-2 font-mono text-sm text-muted-foreground">Input con valor</label>
            <Input defaultValue="Texto de ejemplo" />
          </div>

          <div>
            <label className="block mb-2 font-mono text-sm text-muted-foreground">Input deshabilitado</label>
            <Input disabled placeholder="Deshabilitado" />
          </div>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Esto es un alert informativo.</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Ocurrió un problema inesperado.</AlertDescription>
          </Alert>

          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>La operación fue completada correctamente.</AlertDescription>
          </Alert>
        </TabsContent>

        {/* Cards */}
        <TabsContent value="cards" className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card básica</CardTitle>
              <CardDescription>Ejemplo de card simple</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Este es el contenido dentro de la card.</p>
            </CardContent>
            <CardFooter>
              <Button>Acción</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card secundaria</CardTitle>
              <CardDescription>Con más información</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Podés usar esto como layout para componentes o vistas.</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Confirmar</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
