
class Adaptor{
	
	constructor(machine, index, info){
		this.machine= machine
		
		this.manager= machine.manager
		this.index= index
		this.info= info
	}


	async setHostOnly(options){
		var net= options.netname
		var args= ["modifyvm", this.machine.name,
				`--nic${this.index+1}`, "hostonly",
				`--hostonlyadapter${this.index+1}`, net]

		await this.manager.command(args)
	}


	async setInternalNet(options){
		var net= options.netname
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
		vw.info(this.index)
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