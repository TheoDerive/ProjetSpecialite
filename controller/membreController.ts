import { Request, Response } from "express";
import { MembreRepo } from "../app";
import { CreateMembreType } from "../types/MembreTypes";
import { Membre } from "../classes/Membre";

export async function getMembers(req: Request, res: Response) {
  const membres = await MembreRepo.getAll();
  res.status(200);
  res.send(JSON.stringify(membres));
}

export async function getMemberWithId(req: Request, res: Response) {
  const id = Number(req.params.id);

  const membre = await MembreRepo.getById(id);

  res.status(200);
  res.send(JSON.stringify(membre));
}

export async function newMember(req: Request, res: Response) {
  const new_member: CreateMembreType = {
    id: 3,
    email: "Test@gmail.com",
    firstname: "ted",
    image_url: "/",
    is_admin: null,
    lastname: "dre",
    password: "test",
  };

  const membreExist = await Membre.memberAlreadyExist(MembreRepo, [
    {
      name: "email",
      value: new_member.email,
    },
  ]);

  if (membreExist) {
    res.status(400);
    res.send(JSON.stringify({ err: "user already exist" }));
  }

  const membre = MembreRepo.add(new_member).then((membre) => membre);
  res.status(200);
  res.send(JSON.stringify(membre));
}

export async function updateMemberEmail(req: Request, res: Response) {
  const id = req.body.id;
  const newEmail = req.body.email;

  const membreExist = await MembreRepo.getBy([
    { name: "email", value: newEmail },
  ]);

  if (membreExist.length > 0) {
    res.status(400);
    res.send(
      JSON.stringify({ err: "Votre nouvelle adresse email existe deja" }),
    );
  }

  const update = await MembreRepo.updateEmail(newEmail, id);

  if (update) {
    res.status(200);
    res.send(JSON.stringify({ message: "Votre email a bien ete modifer" }));
  } else {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "Il y a eu un probleme lors de la modification de votre adresse email. Veuillez reesseiller",
      }),
    );
  }
}

export async function updatePassword(req: Request, res: Response) {
  const id = req.body.id;

  const db_password = await MembreRepo.getPassword(id);

  const passwordValid = await Membre.isPasswordValid(req.body.old_password, db_password)
  console.log(passwordValid)

  if(!passwordValid){
    res.status(400)
    res.send(JSON.stringify({err: "Mot de passe incorrect"}))
  }

  const update = await MembreRepo.updatePassword(req.body.password, id)


  if (update) {
    res.status(200);
    res.send(JSON.stringify({ message: "Votre mot de passe a bien ete modifer" }));
  } else {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "Il y a eu un probleme lors de la modification de votre mot de passe. Veuillez reesseiller",
      }),
    );
  }
}
