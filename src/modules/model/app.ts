import { Box3, PerspectiveCamera, Scene, Vector3 } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class App {
  private scene: Scene
  private camera: PerspectiveCamera

  constructor(scene: Scene, camera: PerspectiveCamera) {
    this.scene = scene
    this.camera = camera
  }

  public init() {
    this.addObjects()
  }

  private addObjects() {
    const loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    loader.setDRACOLoader(dracoLoader)

    loader.load('/model/GR-09.glb', (gltf) => {
      this.scene.add(gltf.scene)
      this.autofitCamera(gltf)

      const mesh2 = gltf.scene.getObjectByName('部件2')
      mesh2?.traverse(function (child: any) {
        if (child.isMesh) {
          child.material.color.set('#ff7979')
        }
      })

      const mesh1 = gltf.scene.getObjectByName('部件1')
      mesh1?.traverse(function (child: any) {
        if (child.isMesh) {
          child.material.color.set('#686de0')
        }
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
}
