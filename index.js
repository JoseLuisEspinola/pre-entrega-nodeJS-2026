// index.js
// Si usas Node 18+ puedes quitar la importación y usar fetch nativo
import fetch from "node-fetch"; 

// Destructuring y spread para capturar los argumentos
const [methodRaw, resourceRaw, ...params] = process.argv.slice(2);

const method = methodRaw?.toLowerCase();
const resource = resourceRaw?.toLowerCase();

switch (method) {
  case "get":
    if (resource === "products") {
      try {
        const id = params[0]; // opcional
        const url = id
          ? `https://fakestoreapi.com/products/${id}`
          : "https://fakestoreapi.com/products";

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Hubo un problema al obtener productos:", error.message);
      }
    }
    break;

  case "post":
    if (resource === "products") {
      try {
        // Tomamos el precio como el primer número que aparezca
        const priceIndex = params.findIndex(p => !isNaN(p));
        if (priceIndex === -1) throw new Error("Debes indicar un precio numérico");

        const titleParts = params.slice(0, priceIndex);
        const title = titleParts.join(" ");

        const price = Number(params[priceIndex]);
        const category = params[priceIndex + 1];
        const description = params.slice(priceIndex + 2).join(" ");

        const url = "https://fakestoreapi.com/products";
        const newProduct = { title, price, category, description };

        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(newProduct),
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Producto creado:", data);
      } catch (error) {
        console.error("Hubo un problema al crear el producto:", error.message);
      }
    }
    break;

  case "delete":
    if (resource === "products") {
      try {
        const id = params[0];
        if (!id) throw new Error("Debes indicar un ID para eliminar");

        const url = `https://fakestoreapi.com/products/${id}`;
        const response = await fetch(url, { method: "DELETE" });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Producto eliminado:", data);
      } catch (error) {
        console.error("Hubo un problema al eliminar el producto:", error.message);
      }
    }
    break;

  default:
    console.log("\x1b[31mComando no reconocido. Usá:\x1b[0m");
    console.log("GET products");
    console.log("GET products [id]");
    console.log("POST products <title> <price> <category> <description>");
    console.log("DELETE products <id>");
}
