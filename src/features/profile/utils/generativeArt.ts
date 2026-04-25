export function drawGenerativeArt(canvas: HTMLCanvasElement, tripsCount: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  ctx.lineWidth = 1;
  const lines = Math.max(50, tripsCount * 10);
  
  for (let i = 0; i < lines; i++) {
    ctx.beginPath();
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.moveTo(x, y);
    
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 100 + 50;
    
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    
    // Glassmorphism/gradient effect
    const gradient = ctx.createLinearGradient(x, y, x + length, y + length);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.5)'); // Gold
    gradient.addColorStop(1, 'rgba(123, 97, 255, 0)'); // Purple
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
}
