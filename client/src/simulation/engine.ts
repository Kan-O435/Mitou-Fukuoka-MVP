import type { Agent, SimBounds } from './types'

// 単位: px/s, px/s²（すべてピクセル空間）
const DESIRED_SPEED = 80       // 目標速度 (px/s)
const TAU = 0.5                // 速度緩和時間 (s)
const REPULSION_RADIUS = 25    // 衝突回避が働く距離 (px)
const REPULSION_STRENGTH = 4000 // 反発力の強さ (px²/s²)
const ARRIVAL_THRESHOLD = 12   // 目的地到着と判定する距離 (px)

export function createAgents(count: number, bounds: SimBounds): Agent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    vx: 0,
    vy: 0,
    goalX: Math.random() * bounds.width,
    goalY: Math.random() * bounds.height,
  }))
}

// agentsを直接変更する（React state経由にしないことでre-renderを回避）
export function tick(agents: Agent[], dt: number, bounds: SimBounds): void {
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i]

    // 目的地との距離
    const dgx = a.goalX - a.x
    const dgy = a.goalY - a.y
    const distToGoal = Math.sqrt(dgx * dgx + dgy * dgy)

    // 到着したら新しい目的地をランダム設定
    if (distToGoal < ARRIVAL_THRESHOLD) {
      a.goalX = Math.random() * bounds.width
      a.goalY = Math.random() * bounds.height
      continue
    }

    // 目標速度ベクトル（goal方向にDESIRED_SPEED）
    const inv = DESIRED_SPEED / distToGoal
    const desiredVx = dgx * inv
    const desiredVy = dgy * inv

    // 自己駆動力: 現在速度を目標速度に近づける
    let fx = (desiredVx - a.vx) / TAU
    let fy = (desiredVy - a.vy) / TAU

    // 他エージェントからの反発力
    for (let j = 0; j < agents.length; j++) {
      if (i === j) continue
      const b = agents[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      const d = Math.sqrt(d2)
      if (d < REPULSION_RADIUS && d > 0.1) {
        const strength = REPULSION_STRENGTH / d2
        fx += (dx / d) * strength
        fy += (dy / d) * strength
      }
    }

    // 速度更新
    a.vx += fx * dt
    a.vy += fy * dt

    // 最大速度クランプ
    const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy)
    if (speed > DESIRED_SPEED * 2) {
      const s = (DESIRED_SPEED * 2) / speed
      a.vx *= s
      a.vy *= s
    }

    // 位置更新
    a.x += a.vx * dt
    a.y += a.vy * dt

    // 壁バウンス
    if (a.x < 0) { a.x = 0; a.vx = Math.abs(a.vx) * 0.5 }
    if (a.x > bounds.width) { a.x = bounds.width; a.vx = -Math.abs(a.vx) * 0.5 }
    if (a.y < 0) { a.y = 0; a.vy = Math.abs(a.vy) * 0.5 }
    if (a.y > bounds.height) { a.y = bounds.height; a.vy = -Math.abs(a.vy) * 0.5 }
  }
}
