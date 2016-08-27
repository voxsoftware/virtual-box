var Vbox= core.org.voxsoftware.VirtualBox
class Nat extends Vbox.Network{
	static default(){
		if(!Nat.$default)
			Nat.$default= new Nat()
		return Nat.$default
	}

	get type(){
		return Vbox.NetworkType.Nat
	}
}
export default Nat