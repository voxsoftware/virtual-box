var Vbox= core.org.voxsoftware.VirtualBox
class Adaptor{
	
	constructor(machine, index, info){
		this.machine= machine
		this.manager= machine.manager
		this.index= index
		this.info= info
	}


	async setHostOnly(options){
		var net= options.name
		var args= ["modifyvm", this.machine.name,
				`--nic${this.index+1}`, "hostonly",
				`--hostonlyadapter${this.index+1}`, net]

		await this.manager.command(args)
	}

	get networkName(){
		return this.info.networkName
	}

	get networkType(){
		return Adaptor.stringToNetworkType()[this.info.networkType]
	}

	get type(){
		return Vbox.AdaptorType[this.info.type]
	}

	static stringToNetworkType(){
		return {
			"hostonly": Vbox.NetworkType.HostOnly,
			"natnetwork": Vbox.NetworkType.NatNetwork,
			"nat": Vbox.NetworkType.Nat,
			"intnet": Vbox.NetworkType.Internal
		}
	}

	async network(){
		var networks=[]
		if(this.info.networkType=="hostonly")
			networks= await this.manager.networks.list(Vbox.NetworkType.HostOnly)
		else if(this.info.networkType=="natnetwork")
			networks= await this.manager.networks.list(Vbox.NetworkType.HostOnly)

		for(var i=0;i<networks.length;i++){
			if(networks[i].name== this.networkName)
				return networks[i]
		}

	}

	async setNetwork(network){
		if(network instanceof Vbox.HostOnlyNetwork)
			await this.setHostOnly(network)
		else if(network instanceof Vbox.NatNetwork)
			await this.setNatNetwork(network)
		else if(network instanceof Vbox.Nat)
			await this.setNat(network)
		else
			throw new core.System.NotImplementedException("Aún no está disponible esta opción")

	}


	

	async setInternalNet(options){
		var net= options.name
		var args= ["modifyvm", this.machine.name,
				`--nic${this.index+1}`, "intnet",
				`--intnet${this.index+1}`, net]

		if(options.type){
			args.push("--nictype")
			args.push(options.type)
		}

		await this.manager.command(args)		
	}


	async setNat(options){
		await this.manager.command(["modifyvm", this.machine.name,
				`--nic${this.index+1}`, "nat"])

		
	}


	async reload(){
		var adaptor= await this.machine._internal_adaptors()
		this.info= adaptor[this.index]
	}


	get MAC(){
		return this.info.MAC
	}

	get name(){
		return this.info.Name
	}

	get status(){
		return this.info.Status
	}

	get broadcast(){
		return this.info.Broadcast
	}

	get IP(){
		return this.info.IP
	}

	get netMask(){
		return this.info.Netmask
	}
}
export default Adaptor