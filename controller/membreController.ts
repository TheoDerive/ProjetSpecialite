import { Request, Response } from "express";
import { GetRoleRepo, MembreRepo } from "../app";
import { CreateMembreType } from "../types/MembreTypes";
import { Membre } from "../classes/Membre";
import { membreRoute } from "../routes/membres";

export async function getMembers(req: Request, res: Response) {
  const resultParams = req.body.resultParams;
  const filterParams = req.body.filterParams;

  const membres = await MembreRepo.getBy(resultParams, filterParams);

  res.status(200);
  res.send(JSON.stringify(membres));
}

export async function getMe(req: Request, res: Response) {
  const membre = req.user

  res.status(200);
  res.send(JSON.stringify(membre));
}

export async function newMember(req: Request, res: Response) {
  const { email, firstname, lastname, password, is_admin, image_url } =
    req.body;

  const membreLength = await MembreRepo.getBy([], [])

  const authToken = Membre.createToken(membreLength.length + 1);

  const new_member: CreateMembreType = {
    id: membreLength.length + 1,
    email,
    firstname,
    lastname,
    password,
    is_admin,
    image_url,
    token: authToken,
  };

  const emailExist = await Membre.memberAlreadyExist(MembreRepo, [
    {
      name: "email",
      value: new_member.email,
    },
  ]);

  const personExist = await Membre.memberAlreadyExist(MembreRepo, [
    {
      name: "firstname",
      value: new_member.firstname,
    },
    {
      name: "lastname",
      value: new_member.lastname,
    },
  ]);

  if (emailExist || personExist) {
    res.status(400);
    res.send(
      JSON.stringify({
        err: "Un membre avec les memes informations exite deja",
      }),
    );
  } else {
    const membre = await MembreRepo.add(new_member);
    res.cookie("token", authToken, {
      httpOnly: true,
    })
    res.status(200);
    res.send(JSON.stringify(membre));
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const emailValid = await MembreRepo.getBy(
    ["Id_Membre", "email", "password"],
    [{ name: "email", value: email }],
  );

  if (emailValid.length === 0) {
    res.status(400);
    res.send(
      JSON.stringify({
        err: "L'adresse email que vous chercher n'est pas enregistrer",
      }),
    );
  } else {
    const passwordValid = await Membre.isPasswordValid(
      password,
      emailValid[0].getPassword(),
    );

    if (!passwordValid) {
      res.status(400);
      res.send(
        JSON.stringify({
          err: "L'adresse email et ne mot de passe ne correspondent pas",
        }),
      );
    } else {
      const token = Membre.createToken(emailValid[0].id)
      const valid = await MembreRepo.login(emailValid[0].id, token)

      res.cookie("token", token, {
        httpOnly: true,
      })
      
      const membre = await MembreRepo.getBy(["email", "firstname", "lastname", "Id_Membre", "is_admin", "image_url"], [{name: "Id_Membre", value: emailValid[0].id}])

      res.status(200);
      res.send(JSON.stringify({ message: "connection ok", value: membre }));
    }
  }
}

export async function logout(req: Request, res: Response) {
  const id = req.body.id;

  const membreExist = await MembreRepo.getBy(
    [],
    [{ name: "Id_Membre", value: id }],
  );

  if (membreExist.length === 0) {
    res.status(400);
    res.send(
      JSON.stringify({
        err: "Il y a eu une erreur lors de votre requete, veuillez reessayer",
      }),
    );
  } else {
    const update = await MembreRepo.logout(id);

    if (update) {
      res.clearCookie("token")
      console.log('logout')
      res.status(200);
      res.send(JSON.stringify({ message: "Vous etes bien deconnecter" }));
    } else {
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Il y a eu un probleme lors de votre deconnection. Veuillez reesseiller",
        }),
      );
    }
  }
}

export async function updateMemberEmail(req: Request, res: Response) {
  const id = req.body.id;
  const newEmail = req.body.email;

  console.log(req.body)

  const membreExist = await MembreRepo.getBy(
    [],
    [{ name: "email", value: newEmail }],
  );

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

  const db_password = await MembreRepo.getBy(
    ["password"],
    [{ name: "Id_Membre", value: id }],
  );

  const passwordValid = await Membre.isPasswordValid(
    req.body.old_password,
    db_password[0].getPassword(),
  );

  if (!passwordValid) {
    res.status(400);
    res.send(JSON.stringify({ err: "Mot de passe incorrect" }));
  }

  const update = await MembreRepo.updatePassword(req.body.password, id);

  if (update) {
    res.status(200);
    res.send(
      JSON.stringify({ message: "Votre mot de passe a bien ete modifer" }),
    );
  } else {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "Il y a eu un probleme lors de la modification de votre mot de passe. Veuillez reesseiller",
      }),
    );
  }
}

export async function erease(req: Request, res: Response) {
  const id = req.params.id;

  const membre_valid = await MembreRepo.getBy(
    ["Id_Membre"],
    [{ name: "Id_Membre", value: Number(id) }],
  );

  if (membre_valid.length === 0) {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "Le membre que vous essayer de supprimer n'existe pas",
      }),
    );
  } else {
    const deleteGetRolesFromMembre = await GetRoleRepo.deleteFromMembre(
      Number(id),
    );

    if (!deleteGetRolesFromMembre) {
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Nous n'avons pas reussi a supprimer les roles auquels le membre est assigner, veuillez reessayer",
        }),
      );
    } else {
      const deleteValid = await MembreRepo.delete(Number(id));

      if (!deleteValid) {
        res.status(500);
        res.send(
          JSON.stringify({
            err: "Nous n'avons pas pu supprimer le membre, veuillez reessayer",
          }),
        );
      } else {
        res.status(200);
        res.send(JSON.stringify({ message: "Le membre a bien ete supprimer" }));
      }
    }
  }
}
