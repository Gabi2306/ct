export const ENVIRONMENTAL_TIPS = [
  // Transporte
  "Caminar 30 minutos al dia no solo reduce emisiones, tambien mejora tu salud cardiovascular.",
  "Usar la bicicleta para trayectos cortos puede reducir tu huella de carbono hasta en un 50%.",
  "Compartir el auto con companeros de trabajo reduce las emisiones per capita significativamente.",
  "Los vehiculos electricos producen cero emisiones directas durante su uso.",
  "Mantener los neumaticos inflados correctamente mejora el consumo de combustible hasta un 3%.",
  "Conducir suavemente y evitar aceleraciones bruscas puede reducir el consumo de combustible un 15-30%.",
  "El transporte publico emite hasta 45% menos CO2 por pasajero que un auto particular.",
  "Planifica tus viajes para combinar varios mandados en una sola salida.",
  "Trabajar desde casa un dia a la semana puede reducir tu huella de carbono anual en un 10%.",
  "Las motocicletas consumen menos combustible que los autos, pero emiten mas contaminantes locales.",
  
  // Alimentacion
  "Reducir el consumo de carne roja a una vez por semana puede reducir tu huella alimentaria un 35%.",
  "Los alimentos locales y de temporada tienen menor huella de carbono por el transporte reducido.",
  "Planificar tus comidas reduce el desperdicio de alimentos, que representa el 8% de las emisiones globales.",
  "Las legumbres son una excelente fuente de proteina con muy baja huella de carbono.",
  "Un dia vegetariano a la semana puede ahorrar el equivalente a 500 km en auto al ano.",
  "Comprar a granel reduce el empaque y las emisiones asociadas a su produccion.",
  "El desperdicio de alimentos en tu hogar se puede reducir hasta un 25% con mejor planificacion.",
  "Congelar alimentos antes de que se venzan evita el desperdicio y ahorra dinero.",
  "Las frutas y verduras feas tienen la misma calidad nutricional y menor impacto ambiental.",
  "Cocinar en casa generalmente produce menos emisiones que pedir comida a domicilio.",
  
  // Energia en el hogar
  "Apagar las luces al salir de una habitacion puede ahorrar hasta 100 kg de CO2 al ano.",
  "Las bombillas LED consumen 75% menos energia que las incandescentes.",
  "Desconectar los aparatos que no usas puede reducir tu consumo de energia un 10%.",
  "Regular el termostato 1 grado menos en invierno ahorra hasta 7% de energia de calefaccion.",
  "Secar la ropa al aire libre en lugar de usar secadora reduce significativamente tu huella.",
  "Lavar la ropa con agua fria ahorra hasta 90% de la energia usada en cada lavado.",
  "Los electrodomesticos con etiqueta A+++ consumen hasta 60% menos energia.",
  "Ventilar tu hogar 10 minutos es suficiente y evita perdidas de calor innecesarias.",
  "Usar cortinas y persianas inteligentemente puede reducir el uso de aire acondicionado.",
  "Ducharse en 5 minutos en lugar de 10 ahorra 30 litros de agua caliente por ducha.",
  
  // Consumo responsable
  "Comprar productos de segunda mano extiende su vida util y reduce emisiones de fabricacion.",
  "Reparar en lugar de reemplazar puede ahorrar hasta 8 veces las emisiones de un producto nuevo.",
  "El fast fashion es responsable del 10% de las emisiones globales de carbono.",
  "Una botella reutilizable puede reemplazar 167 botellas de plastico de un solo uso al ano.",
  "Los productos con menos empaque generalmente tienen menor huella de carbono.",
  "Alquilar herramientas o equipos que usas pocas veces reduce la demanda de produccion.",
  "La economia circular puede reducir las emisiones de la industria hasta en un 45%.",
  "Comprar calidad sobre cantidad reduce el consumo total y las emisiones asociadas.",
  "El reciclaje de aluminio ahorra 95% de la energia necesaria para producir aluminio nuevo.",
  "Donar ropa en buen estado extiende su vida util y reduce la demanda de produccion nueva.",
  
  // Digital y tecnologia
  "Eliminar emails antiguos y vaciar la papelera reduce el consumo de energia de los servidores.",
  "Streaming en HD consume 3 veces mas energia que en calidad estandar.",
  "Extender la vida de tu telefono un ano mas reduce significativamente su huella de carbono.",
  "Las videollamadas producen 97% menos emisiones que los viajes de negocios.",
  "Usar el modo oscuro en pantallas OLED puede reducir el consumo de energia hasta un 60%.",
  "Descargar musica y peliculas en lugar de streamear repetidamente reduce el consumo de datos.",
  
  // Agua
  "Cerrar el grifo mientras te cepillas los dientes ahorra hasta 12 litros por minuto.",
  "Una ducha de 5 minutos usa 35-40 litros, un bano completo usa 150-200 litros.",
  "Reparar un grifo que gotea puede ahorrar hasta 30 litros de agua al dia.",
  "Recolectar agua de lluvia para regar plantas reduce el consumo de agua potable.",
  "Los inodoros de doble descarga pueden ahorrar hasta 50% del agua por uso.",
  
  // General
  "Plantar un arbol puede absorber hasta 22 kg de CO2 por ano.",
  "Compostar residuos organicos reduce las emisiones de metano en vertederos.",
  "Usar bolsas reutilizables evita la produccion de 500 bolsas plasticas al ano por persona.",
  "Las energias renovables ya son mas baratas que los combustibles fosiles en muchos lugares.",
  "Educar a otros sobre el cambio climatico multiplica el impacto de tus acciones.",
  "Pequenas acciones diarias sumadas tienen un gran impacto a largo plazo.",
  "Tu huella de carbono personal es aproximadamente 4-8 toneladas de CO2 al ano.",
  "El objetivo global es reducir las emisiones a 2 toneladas de CO2 per capita para 2050.",
]

export function getRandomTip(): string {
  return ENVIRONMENTAL_TIPS[Math.floor(Math.random() * ENVIRONMENTAL_TIPS.length)]
}

export function getDailyTip(): string {
  // Use the date as seed to get the same tip for the whole day
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const index = dayOfYear % ENVIRONMENTAL_TIPS.length
  return ENVIRONMENTAL_TIPS[index]
}
