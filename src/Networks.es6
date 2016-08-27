var Vbox= core.org.voxsoftware.VirtualBox
class Networks{
		
	constructor(manager){
		this.manager= manager
	}

	async _internal_list(cmd){

		if(!cmd)
			cmd= "hostonlyifs"
		var result= await this.manager.command(["list", cmd])
		var data= result.data.split("\n")
		var str2, y, lista=[], obj, str, x, z, type, currentObj, current
		for(var i=0;i<data.length;i++){
			str= data[i]
			str= str.trim()
			currentObj=null

			if(!obj && str){
				obj={}
				lista.push(obj)
			}


			if(str){
				str= str.split(":")
				if(str.length==1){
					str= str[0]
					
					if(str.startsWith("Port-forwarding")){
						x= str.indexOf("(")
						z= str.indexOf(")", x+1)
						obj.portForward= obj.portForward||{}
						type= str.substring(x+1,z)
						
						if(type=="ipv4"){
							currentObj= obj.portForward.ipv4=obj.portForward.ipv4||[]
						}
						else{
							currentObj= obj.portForward.ipv6=obj.portForward.ipv6||[]
						}


					}

					while(currentObj && true){
						i++
						str= data[i]
						if(!str.startsWith(" ")){
							i--
							break
						}
						else{
							current={}
							currentObj.push(current)
							str2= str.trim()
							str=[]


							x= str2.indexOf(":")
							str.push(str2.substring(0,x))
							z= str2.indexOf(":", x+1)
							str.push(str2.substring(x+1, z))
							x=z
							z= str2.indexOf("]", x+1)
							str.push(str2.substring(x+2, z))
							x=z
							z= str2.indexOf(":", x+2)
							str.push(str2.substring(x+2, z))
							x=z
							z= str2.indexOf("]", x+1)
							str.push(str2.substring(x+2, z))
							x=z
							z= str2.indexOf(":", x+2)
							if(z<0)
								z=str2.length
							str.push(str2.substring(x+2, z))

							current.ipv6= type=="ipv6"
							current.name= str[0]
							current.type= str[1]
							current.hostIp= str[2]
							current.hostPort= str[3]|0
							current.guestIp= str[4]
							current.guestPort= str[5]|0
						}
					}

				}
				else{
					obj[str[0]]= str[1].trim()
				}
			}
			else{
				obj=undefined
			}
		}

		for(var i=0;i<lista.length;i++){
			obj= lista[i]
			obj.type= "host-only"
		}
		return lista
	}


	async listHostOnlys(){
		var l= [], lista
		lista= await this._internal_list()
		for(var i=0;i<lista.length;i++){
			l.push(new Vbox.HostOnlyNetwork(lista[i], this))
		}
		return l
	}

	async listNatNetworks(){
		var l= [], lista
		lista= await this._internal_list("natnetworks")
		for(var i=0;i<lista.length;i++){
			l.push(new Vbox.NatNetwork(lista[i], this))
		}
		return l
	}

	async list(type){
		if(type){
			if(!(type instanceof Vbox.NetworkType))
				throw new core.System.ArgumentException("El argumento debe ser del tipo VirtualBox.NetworkType", "type")
		}
		else{
			type=0
		}

		if(type|0 == Vbox.NetworkType.HostOnly|0)
			return await this.listHostOnlys()
		else if(type|0 == Vbox.NetworkType.NatNetwork|0)
			return await this.listNatNetworks()
	}


	async create(type){

		if(!(type instanceof Vbox.NetworkType))
			throw new core.System.ArgumentException("El argumento debe ser del tipo VirtualBox.NetworkType", "type")

		var cmd=""
		if(type|0 == Vbox.NetworkType.HostOnly|0)
			cmd= "hostonlyif"
		else if(type|0 == Vbox.NetworkType.NatNetwork|0)
			cmd= "natnetwork"


		var result= await this.manager.command([cmd,"create"])
		var i= result.data.indexOf("'")
		var y= result.data.indexOf("'", i+1)
		var created= result.data.substring(i+1, y)
		var list= await this._internal_list()

		for(var i=0;i<list.length;i++){
			if(list[i].Name==created)
				return list[i]
		}
	}

}
export default Networks