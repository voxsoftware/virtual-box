var Vbox= core.org.voxsoftware.VirtualBox
class Network{
	
	constructor(info,networks){
		this.info= info
		this.networks=networks
		if(networks)
			this.manager= networks.manager
	}

	get name(){
		return this.info.NetworkName
	}

	

	get IP(){
		
	}



	get networkName(){
		return this.info.NetworkName
	}


	set IP(val){
		return this.info.IPAddress= val
	}




	async remove(){
		if(this.info.type=="host-only")
			await this.manager.command(["hostonlyif", "remove", this.name])
		else if(this.info.type=="natnetwork")
			await this.manager.command(["natnetwork", "remove", "--netname", this.name])

		else
			throw new core.System.ArgumentException("No se detectó el tipo de red")
	}


	

	

}

export default Network