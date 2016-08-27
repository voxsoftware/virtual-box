var Vbox= core.org.voxsoftware.VirtualBox

class DhcpServers{
	
	constructor(manager){
		this.manager= manager
	}


	add(dhcpServer){
		if(!(dhcpServer instanceof Vbox.DhcpServer))
			throw new core.System.ArgumentException("Debe especificar un parámetro de tipo VirtualBox.DhcpServer", "dhcpServer")

		return dhcpServer.addTo(this)
	}



	async _internal_list(){
		var result= await this.manager.command(["list", "dhcpservers"])
		var data= result.data.split("\n")
		var y, lista=[], obj, str
		for(var i=0;i<data.length;i++){
			str= data[i]
			str= str.trim()

			if(!obj && str){
				obj={}
				lista.push(obj)
			}


			if(str){
				str= str.split(":")
				obj[str[0]]= str[1].trim()
			}
			else{
				obj=undefined
			}
		}

		for(var i=0;i<lista.length;i++){
			obj= lista[i]
			obj.name= obj.NetworkName
			obj.type= obj.NetworkName.startsWith("HostInterfaceNetworking")
			if(obj.type){
				y= obj.NetworkName.indexOf("-")
				obj.NetworkName=obj.NetworkName.substring(y+1)
			}
			obj.type= obj.type?"host-only":"nat"
			obj.networkType= obj.type=="host-only" ? Vbox.NetworkType.HostOnly : Vbox.NetworkType.NatNetwork

		}
		return lista
	}

	async list(){
		var l= [], lista
		lista= await this._internal_list()
		for(var i=0;i<lista.length;i++){
			s= this.manager.__createDhcpServer(lista[i])
			l.push(s)
		}
		return l
	}
	
}
export default DhcpServers