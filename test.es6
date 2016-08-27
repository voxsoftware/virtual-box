var Vbox= require("./main")
var init= async function(){
	try{
		var manager= new Vbox.Manager()
		var machine= manager.machine("homestead-7")
		var adaptor= await machine.adaptors()
		vw.info(await manager.machines())
		return 
		var net= await machine.sharedFolders()
		vw.info(net)		

		//vw.info(await manager.runningMachines())
		return 
		
		await adaptor[0].setHostOnly({
			"netname": "vboxnet1"
		})
		vw.info(adaptor)

		var dhcpServer= new Vbox.HostOnlyDhcpServer()
		dhcpServer.name= "vboxnet3"
		dhcpServer.IP= "192.168.90.100"
		dhcpServer.lowerIp= "192.168.90.101"
		dhcpServer.upperIp= "192.168.90.254"
		dhcpServer.networkMask= "255.255.255.0"
		await manager.dhcpServers.add(dhcpServer)

	}
	catch(e){
		vw.error(e)
	}
}

init()
