// index.js
import fetch from "node-fetch";
import readline from "readline";

// Configuramos la interfaz para leer desde consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function opcionesIngreso() {
  console.log("Ingrese los comandos en el siguiente formato:");
  console.log("GET products");
  console.log("GET products [id]");
  console.log("POST products <title> <price> <category>");
  console.log("DELETE products <id>");
  console.log("SALIR");
}

//console.log("Ingrese un comando (GET, POST, DELETE, SALIR):");
opcionesIngreso();


rl.on("line", async (input) => {
  // while infinito: se corta solo si el usuario escribe SALIR
  while (true) {
    const [methodRaw, resourceRaw, ...params] = input.trim().split(" ");
    const method = methodRaw?.toLowerCase();
    const resource = resourceRaw?.toLowerCase();

    if (method === "salir") {
      console.log("\x1b[94mPrograma finalizado.\x1b[0m");

      rl.close();
      break; // rompe el while
    }
    
    switch (method) {
      case "get":
        if (resource === "products") {
          const id = params[0];
          const url = id
            ? `https://fakestoreapi.com/products/${id}`
            : "https://fakestoreapi.com/products";

          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          console.log("\n");
        }
        break;

      case "post":
        if (resource === "products") {
          const [title, price, category] = params;
          const url = "https://fakestoreapi.com/products";

          const newProduct = { title, price: Number(price), category };

          const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(newProduct),
            headers: { "Content-Type": "application/json" }
          });

          const data = await response.json();
          console.log("Producto creado:", data);
          console.log("\n");
        }
        break;

      case "delete":
        if (resource === "products") {
          const id = params[0];
          const url = `https://fakestoreapi.com/products/${id}`;

          const response = await fetch(url, { method: "DELETE" });
          const data = await response.json();
          console.log("Producto eliminado:", data);
          console.log("\n");
        }
        break;

      default:
        console.log("\x1b[31mComando no reconocido. Usá:\x1b[0m");
    }

    // después de ejecutar, pedimos otro comando
    //console.log("\nIngrese otro comando:");
    opcionesIngreso();
    break; // salimos del while interno, pero rl sigue esperando otra línea
  }
});
