import { useEffect, useRef } from 'react'
import { createAgents, tick } from '../simulation/engine'
import type { Agent, SimBounds } from '../simulation/types'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const AGENT_COUNT = 100
const AGENT_RADIUS = 4

function drawFrame(ctx: CanvasRenderingContext2D, agents: Agent[], bounds: SimBounds) {
  // 背景（部屋）
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, bounds.width, bounds.height)

  // 壁
  ctx.strokeStyle = '#4a9eff'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, bounds.width - 2, bounds.height - 2)

  // エージェント
  for (const agent of agents) {
    const speed = Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy)
    // 速度に応じて色を変化（青 → 赤）
    const t = Math.min(speed / 160, 1)
    const r = Math.round(37 + t * (220 - 37))
    const g = Math.round(99 + t * (50 - 99))
    const b = Math.round(235 + t * (50 - 235))

    ctx.beginPath()
    ctx.arc(agent.x, agent.y, AGENT_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fill()
  }
}

export function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const agentsRef = useRef<Agent[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const bounds: SimBounds = { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
    agentsRef.current = createAgents(AGENT_COUNT, bounds)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let lastTime = performance.now()

    function loop(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05) // 最大50msでキャップ
      lastTime = now

      tick(agentsRef.current, dt, bounds)
      drawFrame(ctx, agentsRef.current, bounds)

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block', borderRadius: '4px' }}
    />
  )
}
