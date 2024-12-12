import { AnimationMixer, Box3, PerspectiveCamera, Scene, Vector3 } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class App {
  private scene: Scene
  private camera: PerspectiveCamera
  private mixer: AnimationMixer | null = null

  constructor(scene: Scene, camera: PerspectiveCamera) {
    this.scene = scene
    this.camera = camera
  }

  public init() {
    this.addObjects()
    this.tic()
  }

  private addObjects() {
    const loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/model/wtex.glb', (gltf: GLTF) => {
      this.scene.add(gltf.scene)
      gltf.scene.position.z = -14
      gltf.scene.position.y = -14

      this.autofitCamera(gltf)

      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]
          materials.forEach(function (material: any) {
            material.depthWrite = true
          })
        }
      })

      const eyeObject = gltf.scene.getObjectByName('Eye')
      console.log('eyeObject', eyeObject)

      // 获取动画mixer并启动动画
      this.mixer = new AnimationMixer(gltf.scene)
      gltf.animations.forEach((clip) => {
        const action = this.mixer?.clipAction(clip)
        action?.play()
      })
    })
  }

  /**
   * 模型居中
   */
  autofitCamera(gltf: GLTF) {
    const box = new Box3().setFromObject(gltf.scene)
    const center = new Vector3()
    box.getCenter(center)
    gltf.scene.position.sub(center)
    const boxSize = new Vector3()
    box.getSize(boxSize)
    const maxSize = Math.max(boxSize.x, boxSize.y, boxSize.z)
    this.camera.position.set(0, 0, maxSize * 1)
  }

  /**
   * 渲染
   */
  private tic() {
    if (this.mixer) {
      this.mixer.update(0.01)
    }
    requestAnimationFrame(() => {
      this.tic()
    })
  }
}
