# Export Mermaid diagrams to PNG
# Usage: Run in PowerShell from repo root
# Ensures dev dependency and generates images to docs/diagrams/png

Write-Host "Installing mermaid-cli...";
npm install --no-audit --no-fund --save-dev @mermaid-js/mermaid-cli;

Write-Host "Exporting diagrams to PNG...";
npx mmdc -i docs/diagrams/architecture.mmd -o docs/diagrams/png/architecture.png;
npx mmdc -i docs/diagrams/uml-classes.mmd -o docs/diagrams/png/uml-classes.png;
npx mmdc -i docs/diagrams/uml-sequence-chatbot.mmd -o docs/diagrams/png/uml-sequence-chatbot.png;
npx mmdc -i docs/diagrams/uml-sequence-reservation.mmd -o docs/diagrams/png/uml-sequence-reservation.png;
npx mmdc -i docs/diagrams/db-schema.mmd -o docs/diagrams/png/db-schema.png;

Write-Host "Done. PNGs are in docs/diagrams/png";